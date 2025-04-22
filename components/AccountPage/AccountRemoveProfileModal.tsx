import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
type Props = {
  handleDeleteProfile: () => void;
};

const AccountRemoveProfileModal = ({ handleDeleteProfile }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteProfilePicture = () => {
    try {
      handleDeleteProfile();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="rounded-full absolute -top-4 -right-7 z-50"
        >
          <XIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to remove your profile picture?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            profile picture?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteProfilePicture}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountRemoveProfileModal;
