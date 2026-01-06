import { useEffect } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";
import { usePlanes } from "../../hooks/usePlanes";
import { PlanCard } from "./PlanCard";

export const PlanesUserList = () => {
  const { planesUser, loading, listAllPlanesUser } = usePlanes();

  useEffect(() => {
    listAllPlanesUser();
  }, [listAllPlanesUser]);

  if (loading) {
    return (
      <Box className="d-flex justify-content-center mt-5">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!planesUser.length) {
    return (
      <Typography className="text-center mt-4" color="text.secondary">
        No hay planes disponibles por el momento
      </Typography>
    );
  }

  return (
    <div className="container mt-4">
      {/* Bootstrap ROW */}
      <div className="row">
        {planesUser.map((plan) => (
          <div key={plan.id} className="col-12 col-sm-6 col-lg-4 mb-4">
            <PlanCard
              nombre={plan.nombre}
              tipo={plan.tipo}
              dias={plan.duracionDias}
              precio={plan.precio}
              onSelect={() => {
                console.log("Plan seleccionado:", plan);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
