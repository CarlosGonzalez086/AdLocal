import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export const ConfigFormHeader = ({ icon, title, subtitle }: Props) => {
  return (
    <Box className="config-form-header">
      <Stack direction="row" spacing={1.5} alignItems="center">
        {icon}
        <Box>
          <Typography className="fz-h2 fw-semibold">{title}</Typography>
          <Typography className="fz-h4 fw-regular" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};