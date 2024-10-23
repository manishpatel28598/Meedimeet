import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);

  //getUsers
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle account
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        {
          doctorId: record._id,
          userId: record.userId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload()
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <span>
            {record.firstName} {record.lastName}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="flex">
            {record.status === "pending" ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-700 rounded"
                onClick={() => handleAccountStatus(record, "approved")}
              >
                Approve
              </button>
            ) : (
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded">
                Reject
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <h1 className="text-center">All doctors</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default Doctor;
