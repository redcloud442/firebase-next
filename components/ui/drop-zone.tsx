import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDropzone } from "react-dropzone";

type AvatarDropzoneProps = {
  avatarUrl: string | null;
  onFileUpload: (file: File) => void;
  email?: string;
};

const AvatarDropzone = ({
  avatarUrl,
  onFileUpload,
  email,
}: AvatarDropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
  });

  const getInitials = (email?: string) => {
    if (!email) return "U";
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-full border-2 ${
        isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <Avatar className="h-20 w-20">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="avatar" />
        ) : (
          <AvatarFallback>{getInitials(email)}</AvatarFallback>
        )}
      </Avatar>
    </div>
  );
};

export default AvatarDropzone;
