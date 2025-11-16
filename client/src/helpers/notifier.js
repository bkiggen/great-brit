// Notifier service for showing toast notifications from anywhere
let enqueueSnackbarRef = null;

export const setSnackbarRef = (enqueueSnackbar) => {
  enqueueSnackbarRef = enqueueSnackbar;
};

export const showSuccess = (message) => {
  if (enqueueSnackbarRef) {
    enqueueSnackbarRef(message, { variant: "success" });
  }
};

export const showError = (message) => {
  if (enqueueSnackbarRef) {
    enqueueSnackbarRef(message, { variant: "error" });
  }
};

export const showInfo = (message) => {
  if (enqueueSnackbarRef) {
    enqueueSnackbarRef(message, { variant: "info" });
  }
};

export const showWarning = (message) => {
  if (enqueueSnackbarRef) {
    enqueueSnackbarRef(message, { variant: "warning" });
  }
};
