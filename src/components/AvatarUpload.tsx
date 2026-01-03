import { useRef } from "react";
import { Avatar } from "@mui/material";


interface Props {
  profile: { fotoUrl?: string };
  onUploadPhoto: (file: File) => void;
}

export const AvatarUpload = ({ profile, onUploadPhoto }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUploadPhoto(file);
  };

  return (
    <div className="col-12 mb-3 d-flex justify-content-center align-items-center gap-2">
      <Avatar
        src={profile.fotoUrl}
        sx={{ width: 128, height: 128, cursor: "pointer" }}
        onClick={handleAvatarClick}
      />

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
};
