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
  title = "작업을 진행할까요?",
  text = "이 작업은 되돌리기 어려울 수 있습니다.",
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
    confirmButtonColor: "#4F46E5",
    cancelButtonColor: "#64748B",
    reverseButtons: true,
    background: "#FFFFFF",
    color: "#0F172A",
  });
};

export const showWarning = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#4F46E5",
    background: "#FFFFFF",
    color: "#0F172A",
  });
};
