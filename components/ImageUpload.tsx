"use client";

import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

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

const ImageUpload = ({
  onFileChange,
}: {
  onFileChange: (filePath: string) => void;
}) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string } | null>(null);
  const { toast } = useToast();

  const onError = (error: any) => {
    console.error(error);

    toast({
      title: "Image upload failed",
      description: "Your image could not be uploaded. Please try again.",
      variant: "destructive",
    });
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: "Image upload successfully",
      description: `${res.filePath} uploaded successfully`,
    });
  };

  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onSuccess={onSuccess}
        onError={onError}
        fileName="test-upload.png"
      />
      <button
        className="upload-btn"
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
        <p className="text-base text-light-100">Upload a File</p>
        {file && <p className="uplaod-filename">{file.filePath}</p>}
      </button>
      {file && (
        <IKImage
          alt={file.filePath}
          path={file.filePath}
          width={500}
          height={300}
        />
      )}
    </ImageKitProvider>
  );
};
export default ImageUpload;
