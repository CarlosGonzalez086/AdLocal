import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import type { FormEvent, ReactNode } from "react";

import styles from "../styles/GenericModal.module.css";

import MaterialSymbol from "./UI/MaterialSymbol/MaterialSymbol";

export interface GenericModalPrimaryAction {
  label: string;
  loadingLabel?: string;
  icon?: string;
  type?: "submit" | "button";
  onClick?: () => Promise<any> | any;
  disabled?: boolean;
}

interface Props {
  open: boolean;

  onClose: (data?: any) => void;

  title: string;
  subtitle?: string;
  icon?: string;

  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";

  fullWidth?: boolean;

  fullScreenMobile?: boolean;

  loading?: boolean;

  onSubmit?: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;

  primaryAction?: GenericModalPrimaryAction;

  secondaryLabel?: string;

  onCancel?: () => Promise<any> | any;

  showCancel?: boolean;

  rejectLabel?: string;

  onReject?: () => Promise<any> | any;

  showReject?: boolean;

  hideActions?: boolean;

  showDivider?: boolean;

  showCloseButton?: boolean;

  zIndex?: number;

  children: ReactNode;
}

export const GenericModal = ({
  open,

  onClose,

  title,

  subtitle,

  icon,

  maxWidth = "md",

  fullWidth = true,

  fullScreenMobile = true,

  loading = false,

  onSubmit,

  primaryAction,

  secondaryLabel = "Cancelar",

  onCancel,

  showCancel = true,

  rejectLabel = "Rechazar",

  onReject,

  showReject = false,

  hideActions = false,

  showDivider = false,

  showCloseButton = true,

  zIndex = 1059,

  children,
}: Props) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    if (loading) return;

    onClose();
  };

  const handleCancel = async () => {
    if (loading) return;

    try {
      const data = onCancel ? await onCancel() : undefined;

      onClose(data);
    } catch (error) {
      console.error("Error al cancelar:", error);
    }
  };

  const handlePrimaryAction = async () => {
    if (loading || primaryAction?.disabled || !primaryAction?.onClick) {
      return;
    }

    try {
      const data = await primaryAction.onClick();

      if (!data?.noClose) {
        onClose(data);
      }
    } catch (error) {
      console.error("Error al ejecutar acción principal:", error);
    }
  };

  const handleReject = async () => {
    if (loading || !onReject) return;

    try {
      const data = await onReject();

      if (!data?.noClose) {
        onClose(data);
      }
    } catch (error) {
      console.error("Error al rechazar:", error);
    }
  };

  const body = (
    <>
      <DialogTitle
        id="generic-modal-title"
        className={`${styles.dialogTitle} d-flex justify-content-between align-items-center p-3 gap-3`}
      >
        <div className="d-flex justify-content-start align-items-center gap-3 w-100">
          {icon && (
            <div className={styles.titleIcon}>
              <MaterialSymbol icon={icon} size="large" />
            </div>
          )}

          <div className="d-flex justify-content-start align-items-start flex-column">
            <h2 className="fz-h2 fw-bold mb-0">{title}</h2>

            {subtitle && <h4 className="fz-h4 fw-regular mb-0">{subtitle}</h4>}
          </div>
        </div>

        {showCloseButton && (
          <Button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className={styles.closeButton}
            aria-label="Cerrar"
          >
            <MaterialSymbol icon="close" size="medium" />
          </Button>
        )}
      </DialogTitle>

      {showDivider && <div className={styles.divider} />}

      <DialogContent className={styles.dialogContent}>{children}</DialogContent>

      {!hideActions && (
        <DialogActions
          className={`${styles.dialogActions} d-flex justify-content-end align-items-center p-3 gap-3`}
        >
          <div>
            {showReject && onReject && (
              <Button
                type="button"
                onClick={handleReject}
                disabled={loading}
                className="btn-adlocal btn-adlocal--danger fz-h4 fw-medium"
              >
                {rejectLabel}
              </Button>
            )}
          </div>

          <div className="d-flex justify-content-end align-items-center gap-3">
            {showCancel && !showReject && (
              <Button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="btn-adlocal btn-adlocal--ghost fz-h4 fw-medium"
              >
                {secondaryLabel}
              </Button>
            )}

            {primaryAction && (
              <Button
                type={primaryAction.type ?? "button"}
                onClick={
                  primaryAction.type === "submit"
                    ? undefined
                    : handlePrimaryAction
                }
                disabled={loading || primaryAction.disabled}
                className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
                startIcon={
                  loading || !primaryAction.icon ? undefined : (
                    <MaterialSymbol icon={primaryAction.icon} size="small" />
                  )
                }
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={18}
                      thickness={4}
                      className={styles.saveProgress}
                    />

                    <span>{primaryAction.loadingLabel ?? "Guardando..."}</span>
                  </>
                ) : (
                  primaryAction.label
                )}
              </Button>
            )}
          </div>
        </DialogActions>
      )}
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreenMobile && isMobile}
      aria-labelledby="generic-modal-title"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },

        backdrop: {
          className: styles.dialogBackdrop,
        },
      }}
    >
      {onSubmit ? (
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {body}
        </Box>
      ) : (
        body
      )}
    </Dialog>
  );
};
