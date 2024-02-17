import React from 'react'
import moment from 'moment'
import classNames from 'classnames'

export default function ActivityList(props) {


  
  const text = props.activities.slice(props.activities.length - 10).map((activty) => {
    let classes = classNames({
		
      'bg-blue-300 rounded-md mb-4 py-2 px-2': activty.tss < 25,
      'bg-yellow-300 rounded-md mb-4 py-2 px-2': activty.tss > 25 && activty.tss < 40,
      'bg-orange-300 rounded-md mb-4 py-2 px-2': activty.tss > 40 && activty.tss < 50,
      'bg-red-300 rounded-md mb-4 py-2 px-2': activty.tss > 60
  
    });
    let date = new Date(activty.start_date)
    return <p className={classes} >{activty.name}  - {activty.type} : {moment(date).format('DD-MM-YYYY')} - {activty.tss}</p>
  })
  return (
    <>
    <h2 className='text-xl'>Last 10 activities</h2>
    <div>{text}</div>
    </>
  )
}
