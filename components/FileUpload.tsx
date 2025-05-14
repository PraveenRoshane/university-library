"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import config from "@/lib/config";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const authenticator = async () => {
  try {
    const responce = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!responce.ok) {
      const errorText = await responce.text();

      throw new Error(
        `Request failed with status ${responce.status}: ${errorText}`,
      );
    }

    const data = await responce.json();
    const { signature, expire, token } = data;

    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.error(error);

    toast({
      title: `${type} upload failed`,
      description: `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: `${type} upload successfully`,
      description: `${res.filePath} uploaded successfully`,
    });
  };

  const onValidate = (file: any) => {
    if (type === "image") {
      if (file.size > 1024 * 1024 * 20) {
        toast({
          title: "File size too large",
          description: "Please upload a file smaller than 20MB.",
          variant: "destructive",
        });
        return false;
      }
    } else if (type === "video") {
      if (file.size > 1024 * 1024 * 50) {
        toast({
          title: "File size too large",
          description: "Please upload a file smaller than 50MB.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percentage = Math.round((loaded / total) * 100);
          setProgress(percentage);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />
      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="Upload"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
        {file && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
      </button>
      {progress > 0 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
      {file.filePath &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};
export default FileUpload;
