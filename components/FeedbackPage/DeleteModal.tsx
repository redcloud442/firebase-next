import { Trash } from "lucide-react";
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

type DeleteModalProps = {
  onDelete: () => void;
  isDeleting: boolean;
};

const DeleteModal = ({ onDelete, isDeleting }: DeleteModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="absolute top-2 right-2">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Feedback</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this feedback?
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
