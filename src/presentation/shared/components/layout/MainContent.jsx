import React from 'react'

const MainContent = ({className,children, tittle}) => {
  return (
    <div className={className}>
        {tittle &&<h1>{tittle}</h1>}
        {children}
    </div>
  )
}


export default MainContent