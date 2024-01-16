import React from 'react'

const ReturnProfile = ({athlete}) => {
   
    return (
      <div>
       {athlete.profile && <img className='h-16' src={athlete.profile} alt="profile" /> }
       {athlete &&  <p className="py-4">
          You are logged in as {athlete.firstname} {athlete.lastname}
        </p> }
      </div>
    );
  };

  export default ReturnProfile;
