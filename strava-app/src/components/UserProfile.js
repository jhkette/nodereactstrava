import React from 'react'

const ReturnProfile = ({athlete}) => {
   
    return (
      <div className='flex justify-end'>
        <div className='flex  flex-col items-end'>
       {athlete.profile && <img className='h-12' src={athlete.profile} alt="profile" /> }
       {athlete &&  <p className="pt-4">
          You are logged in as {athlete.firstname} {athlete.lastname}
        </p> }
        </div>
      </div>
    );
  };

  export default ReturnProfile;
