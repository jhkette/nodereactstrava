import React from 'react'
import moment from 'moment'

export default function ActivityList(props) {
  
  const text = props.activities.slice(props.activities.length - 10).map((activty) => {
    let date = new Date(activty.start_date)
    return <p>{activty.name}  - {activty.type} : {moment(date).format('DD-MM-YYYY')} - {activty.tss}</p>
  })
  return (
    <>
    <h2 className='text-xl'>Last 10 activities</h2>
    <div>{text}</div>
    </>
  )
}
