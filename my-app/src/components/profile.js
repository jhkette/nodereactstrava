import React from 'react'

const ReturnProfile = ({athlete}) => {
    console.log("this is athlete" + athlete)
    return (
      <div>
        <img className='h-16' src={athlete.profile} alt="profile" />
        <p className="py-4">
          You are logged in as {athlete.firstname} {athlete.lastname}
        </p>
      </div>
    );
  };

  export default ReturnProfile;
