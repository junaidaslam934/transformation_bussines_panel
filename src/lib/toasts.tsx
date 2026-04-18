import ICONS from "@/assets/icons";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

export function successToast(message: string, title: string = "Success") {
  toast({
    variant: "default",
    title: (
      <div className="flex items-center gap-4 !py-10 text-sm !rounded-xl">
        <span className="w-10 h-10 rounded-full flex justify-center items-center shrink-0">
          <Image
          src={ICONS.toastSuccess}
          alt="success"
          width={40}
          height={40}
          />
        </span>
        {/* <Image src={ICONS.toastSuccess} alt="success" width={35} height={35} priority={true} /> */}
        <div>
          <span className="first-letter:capitalize font-semibold text-darkGray">{title}</span>
          <p className="font-normal text-lightGray">{message}</p>
        </div>
      </div>
    ) as any,
    duration: 3000,
  });
}
export function errorToast(message: string, title: string = "Error") {
  toast({
    variant: "destructive",
    title: (
      <div className="flex items-center gap-4 !py-10 text-sm">
        <span className="shrink-0 w-10 h-10 rounded-full bg-white flex justify-center items-center">
          <RxCross2 size={23} color="#ed4a1f" strokeWidth={0.3} />
        </span>
        {/* <Image src={ICONS.toastError} alt="error" width={35} height={35} priority={true} /> */}
        <div>
          <span className="first-letter:capitalize font-semibold">{title}</span>
          <p className="font-normal">{message}</p>
        </div>
      </div>
    ) as any,
    duration: 3000,
  });
}
