import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex flex-col m-2"
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <div className="text-xl bg-slate-400 p-1 text-center cursor-pointer">
          Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="border-r border-b border-l border-t border-gray-400 lg:border-2-2 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-2 ps-2 text-slate-600  flex flex-col justify-between leading-normal">
          <p className="pt-2">
            <b>Contact no.</b> : {doctor.phone}
          </p>
          <p className="pt-2">
            <b>Specialization</b> : {doctor.specialization}
          </p>
          <p className="pt-2"> 
            <b>Timings</b> : {doctor.timings[0]} - {doctor.timings[1]}
          </p>
          <p className="pt-2">
            <b>Cunst. Fee</b> : {doctor.feesPerCunsultation}
          </p>
          <p className="pt-2">
            <b>Experience</b> : {doctor.experience}
          </p>
        </div>
      </div>
    </>
  );
};

export default DoctorList;
