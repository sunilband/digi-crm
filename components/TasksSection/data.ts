type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string,
    priority: number,
  }
  
  export const payments: Payment[] = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
      priority: 2,
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
      priority: 1,
    },
    
  ]
  