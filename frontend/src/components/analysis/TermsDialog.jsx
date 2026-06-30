import * as Dialog from "@radix-ui/react-dialog";
import "@styles/components/dialog.css";

const TermsDialog = ({ open, onOpenChange, onAgree }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content terms-dialog">
          <div className="dialog-head">
            <Dialog.Title>분석 약관 동의</Dialog.Title>
            <Dialog.Close aria-label="닫기">×</Dialog.Close>
          </div>
          <div className="terms-body">
            <p>
              CommitLens는 업로드한 Git 산출물과 GitHub 저장소 정보를 분석 목적으로만 사용합니다.
              비밀번호, 개인 토큰, 운영 환경 변수처럼 민감한 값이 포함된 파일은 업로드하지 않는 것을 권장합니다.
            </p>
            <label className="check-row">
              <input type="checkbox" defaultChecked />
              분석 대상 데이터 처리와 결과 저장에 동의합니다.
            </label>
            <label className="check-row">
              <input type="checkbox" defaultChecked />
              AI 분석 결과는 참고용이며 최종 검토는 사용자가 수행하는 것에 동의합니다.
            </label>
          </div>
          <button className="primary-action" type="button" onClick={onAgree}>
            동의하고 분석 시작
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TermsDialog;
