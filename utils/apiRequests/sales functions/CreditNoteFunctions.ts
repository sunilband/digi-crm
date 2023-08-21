// get invoice
export const getCreditNotes = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GET_CREDIT_NOTES}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("Update user error", error);
  }
};

//   create task
export const createCreditNote = async (token: string, data: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CREATE_CREDIT_NOTE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("Update user error", error);
  }
};

//   update task
export const updateCreditNote = async (token: string, data: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_UPDATE_CREDIT_NOTE}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("Update user error", error);
  }
};
