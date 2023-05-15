import React, { useContext } from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import profile from "../../images/profile.png"

const ProfileCard = ({ fName, addressTo,partialhandle }) => {
  //const gifUrl = useFetch({ keyword });
  function afterClick(){
    partialhandle(fName,addressTo)
    window.scroll({top: 0, behavior: 'smooth'});
  }
  return (
    <div
      className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[200px]
      2xl:max-w-[250px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex  w-full mb-6 p-2 ">
          <div className="flex justify-center">
        <img
        onClick={afterClick}
          src={profile}
          alt="nature"
          className="w-3/4 h-1/2  rounded-2xl  object-cover "
        />
        </div>
          <p className="text-white text-base flex justify-center">{fName}</p>

          <p className="text-white text-base flex justify-center">
            Add: {shortenAddress(addressTo)}
          </p>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const { members, currentAccount, getAllMember,partialhandle } =
    useContext(TransactionContext);
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <div>
            <h3
              onClick={getAllMember}
              className="text-white text-3xl text-center my-2 hover:cursor-pointer"
            >
              Latest People
            </h3>
          </div>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}

        <div className="flex flex-wrap justify-center items-center mt-10">
          {[...members].reverse().map((member, i) => (
            <ProfileCard key={i} {...member} partialhandle={partialhandle}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
