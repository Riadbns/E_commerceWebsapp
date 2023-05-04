fetch(`/success`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
  .then(() => {
    fetch(`/success`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  });


