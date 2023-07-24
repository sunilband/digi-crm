// get tasks
export const getTasks = async (token:string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_GET_TASKS}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //     userID:data
            // }),
        });
        const responseData = await response.json();
        return responseData
    } catch (error) {
      console.log("Update user error",error)
    }
  };

  //   create task
export const createTask = async (token:string,data:any) => {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CREATE_TASK}`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData
  } catch (error) {
    console.log("Update user error",error)
  }
};

//   update task
export const updateTask = async (token:string,data:any) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_UPDATE_TASK}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        return responseData
    } catch (error) {
      console.log("Update user error",error)
    }
  };