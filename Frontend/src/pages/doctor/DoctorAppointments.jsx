import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
import Layout from "../../components/Layout";

const DoctorAppointments = () => {
  const [appointmetns, setAppointments] = useState([]);
  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        { appointmentsId: record._id, status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if(res.data.success){
        message.success(res.data.message)
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("something Went Wrong");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mx-2"
                onClick={() => {
                    handleStatus(record, "approved");
                }}
              >
                Approved
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
                onClick={() => {
                    handleStatus(record, "reject");
                }}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div>Appointments Lists</div>
      <Table columns={columns} dataSource={appointmetns} />
    </Layout>
  );
};

export default DoctorAppointments;
