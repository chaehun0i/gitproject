import Swal from "sweetalert2";
import { toast } from "sonner";

export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  loading: (message) => toast.loading(message),
  dismiss: (id) => toast.dismiss(id),
};

export const confirmAction = ({
  title = "진행할까요?",
  text = "이 작업은 되돌릴 수 없습니다.",
  confirmButtonText = "확인",
  cancelButtonText = "취소",
  icon = "warning",
} = {}) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    cancelButtonText,
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
  });
};

export const showWarning = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#2563eb",
  });
};
