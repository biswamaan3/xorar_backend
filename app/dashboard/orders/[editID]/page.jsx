"use client";
import React, { useEffect, useState } from "react";
import OrderDetailsForm from "../../DemoPage";

const getData = async (editID) => {
  const res = await fetch(`/api/order/${editID}`);
  const data = await res.json();
  if (data.success) {
    return data;
  }
  throw new Error("Failed to fetch data");
};

function Page({ params }) {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { editID } = await params;  
      try {
        const data = await getData(editID);
        console.log(data);
        setOrderData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <OrderDetailsForm data={orderData.order} />;
}

export default Page;
