import React from 'react'

import { List as MUIList, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide} from '@material-ui/core'
import { Delete, MoneyOff} from '@material-ui/icons'
import useStyles from './styles'

export const List = () => {
  const classes = useStyles()
  const transactions = [
    {id: 1, amount: '10', date: new Date(), category: 'Salary', type: 'Income'}
  ];
  return (
  <MUIList dense={false} className={classes.list}>
    {transactions.map((transaction) => (
      <Slide direction='down' in mountOnEnter unmountOnExit key={transaction.id}>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={transaction.type === 'Income' ? classes.avatarIncome : classes.avatarExpense}>
              <MoneyOff />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={transaction.category} secondary={`${transaction.amount} - ${transaction.date}`} />
          <ListItemSecondaryAction>
            <IconButton edge='end' aria-label='delete' onClick={() => console.log('clicked button')}>
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </Slide>
    ))}
  </MUIList>)
}