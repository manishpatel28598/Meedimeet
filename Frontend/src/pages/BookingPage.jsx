import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState([]);
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState();


  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorbyId",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //======handle availability
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availability",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        // setIsAvailable(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // ======Booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if(!date && !time){
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error.response);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <div className="text-xl font-bold text-center p-2">Booking Page</div>
      <div className="container">
        {doctors && (
          <div className="text-xl font-normal m-4">
            Dr. {doctors.firstName} {doctors.lastName}
            <div className="text-xl font-normal">
              Fees : {doctors.feesPerCunsultation}
            </div>
            <div className="text-xl font-normal">
              Timings : {doctors.timings && doctors.timings[0]} -{" "}
              {doctors.timings && doctors.timings[1]}{" "}
            </div>
            <div className="flex flex-col ">
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  if (value) {
                    // setIsAvailable(true);
                    setDate(value.format("DD-MM-YYYY"));
                  } else {
                    setDate(null);
                  }
                }}
              />
              <TimePicker
                format="HH:mm"
                className="m-2"
                onChange={(value) => {
                  if (value) {
                    // setIsAvailable(true);
                    setTime(value.format("HH:mm"));
                  } else {
                    setTime(null);
                  }
                }}
              />
              <Button
                className="btn btn-primary mt-2"
                type="primary"
                htmlType="submit"
                onClick={handleAvailability}
              >
                Check Availability
              </Button>
              {!isAvailable && (
                <Button
                  color="default"
                  variant="solid"
                  className="btn btn-dark mt-2"
                  type="primary"
                  htmlType="submit"
                  onClick={handleBooking}
                >
                  Book Now
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
