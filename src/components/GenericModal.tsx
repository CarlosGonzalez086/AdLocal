import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { FormEvent, ReactNode } from "react";
import styles from "../styles/GenericModal.module.css";
import MaterialSymbol from "./UI/MaterialSymbol/MaterialSymbol";

export interface GenericModalPrimaryAction {
  label: string;
  loadingLabel?: string;
  icon?: string;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  primaryAction?: GenericModalPrimaryAction;
  secondaryLabel?: string;
  hideActions?: boolean;
  children: ReactNode;
}

export const GenericModal = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  maxWidth = "md",
  loading = false,
  onSubmit,
  primaryAction,
  secondaryLabel = "Cancelar",
  hideActions = false,
  children,
}: Props) => {
  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const body = (
    <>
      <DialogTitle className={styles.dialogTitle}>
        <Box className={styles.titleIcon}>
          <MaterialSymbol icon={icon} size="large" />
        </Box>

        <Box className={styles.titleText}>
          <Typography
            component="h2"
            className={`${styles.title} fz-h2 fw-bold`}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              component="p"
              className={`${styles.subtitle} fz-h4 fw-regular`}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>{children}</DialogContent>

      {!hideActions && (
        <DialogActions className={styles.dialogActions}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="btn-adlocal btn-adlocal--ghost fz-h4 fw-medium"
          >
            {secondaryLabel}
          </Button>

          {primaryAction && (
            <Button
              type={primaryAction.type ?? "button"}
              onClick={primaryAction.onClick}
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
        </DialogActions>
      )}
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="generic-modal-title"
      slotProps={{
        paper: { className: styles.dialogPaper },
        backdrop: { className: styles.dialogBackdrop },
      }}
    >
      {onSubmit ? (
        <Box component="form" onSubmit={onSubmit} noValidate>
          {body}
        </Box>
      ) : (
        body
      )}
    </Dialog>
  );
};
