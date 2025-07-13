import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserRoleManagementExport } from "@/service/user/auth";
import { File } from "lucide-react";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "sonner";
import TableLoading from "../ui/table-loading";

const UserManagementExport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [nextPageTokens, setNextPageTokens] = useState<string[]>([""]);
  const [exportData, setExportData] = useState<
    {
      id: string;
      email: string;
      dateCreated: string;
      "Car Driving Lessons": number;
      "Car Video Lessons": number;
      "Motorcycle Driving Lessons": number;
      "Motorcycle Video Lessons": number;
      "Road Sign Quiz": number;
    }[]
  >([]);
  const [headers, setHeaders] = useState<{ label: string; key: string }[]>([]);

  const csvLinkRef = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);

  const onSubmit = async () => {
    try {
      const limit = 500;
      let page = 1;
      let totalCount = 0;
      let allData: {
        id: string;
        email: string;
        dateCreated: string;
        "Car Driving Lessons": number;
        "Car Video Lessons": number;
        "Motorcycle Driving Lessons": number;
        "Motorcycle Video Lessons": number;
        "Road Sign Quiz": number;
      }[] = [];

      setIsLoading(true);

      while (true) {
        const { data, count, nextPageToken } =
          await getUserRoleManagementExport({
            nextPageToken: nextPageTokens[page - 1] || undefined,
            limit,
          });

        if (!data) break;

        const currentBatch = data;
        totalCount = count;

        allData = [...allData, ...currentBatch];

        if (nextPageToken) {
          setNextPageTokens([...nextPageTokens, nextPageToken]);
        }

        const totalPages = Math.ceil(totalCount / limit);
        if (page >= totalPages) break;

        page++;
      }

      if (allData.length === 0) return;

      const generatedHeaders = Object.keys(allData[0]).map((key) => ({
        label: key,
        key,
      }));

      setExportData(allData);
      setHeaders(generatedHeaders);

      setTimeout(() => {
        csvLinkRef?.current?.link.click();
      }, 100);

      setIsOpen(false);

      toast.success("CSV generated successfully");
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <>
      {exportData.length > 0 && (
        <CSVLink
          data={exportData}
          headers={headers}
          filename={`users_export.csv`}
          ref={csvLinkRef}
          className="hidden"
        />
      )}

      {isLoading && <TableLoading />}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <File />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Users</DialogTitle>
            <DialogDescription>
              This action will export all users to a CSV file. Please be patient
              as this may take a while.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onSubmit}>Export</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagementExport;
