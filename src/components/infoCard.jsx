import React from 'react'

const isIncome = Math.round(Math.random())

// Random text helper
export const InfoCard = () => {
  return (
    <div style={{ textAlign: 'center', padding: '0 10%' }}>
      Try saying: <br />
      Add {isIncome ? 'Income ' : 'Expense '}
      for {isIncome ? '€100 ' : '€50 '}
      in Category {isIncome ? 'Salary ' : 'House '}
      for {isIncome ? 'Monday ' : 'Friday '}
    </div>
  )
}
