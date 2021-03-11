import React, { useEffect, useState, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'

import {
  TextField,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { useSpeechContext } from '@speechly/react-client'
import { CustomisedSnackbar } from '../../Snackbar/Snackbar'
import { formatDate } from '../../../utils/formatDate'
import { ExpenseTrackerContext } from '../../../context/context'
import {
  incomeCategories,
  expenseCategories,
} from '../../../constants/categories'

import useStyles from './styles'

const initialState = {
  amount: '',
  category: '',
  type: 'Income',
  date: formatDate(new Date()),
}

export const Form = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const { segment } = useSpeechContext()
  const { addTransaction } = useContext(ExpenseTrackerContext)
  const selectedCategories =
    formData.type === 'Income' ? incomeCategories : expenseCategories

  const createTransaction = () => {
    // Bail if there's no amount or date supplied
    if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-'))
      return

    const transaction = {
      ...formData,
      amount: Number(formData.amount),
      id: uuidv4(),
    }

    // opens the alert
    setOpen(true)

    // creates the transaction
    addTransaction(transaction)

    // resets state
    setFormData(initialState)
  }

  // Handles voice commands for creating transactions.
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (segment) {
      if (segment.intent.intent === 'add_expense') {
        setFormData({ ...formData, type: 'Expense' })
      } else if (segment.intent.intent === 'add_income') {
        setFormData({ ...formData, type: 'Income' })
      } else if (
        segment.isFinal &&
        segment.intent.intent === 'create_transaction'
      ) {
        return createTransaction()
      } else if (
        segment.isFinal &&
        segment.intent.intent === 'cancel_transaction'
      ) {
        return setFormData(initialState)
      }

      segment.entities.forEach((entity) => {
        // String format the entity to Capitalise case
        const category = `${entity.value.charAt(0)}${entity.value
          .slice(1)
          .toLowerCase()}`

        switch (entity.type) {
          case 'amount':
            setFormData({ ...formData, amount: entity.value })
            break
          case 'category':
            // If the user confused a category with the income / expense types this autofixes the command.
            if (incomeCategories.map((ic) => ic.type).includes(category)) {
              setFormData({ ...formData, type: 'Income', category })
            } else if (
              expenseCategories.map((ic) => ic.type).includes(category)
            ) {
              setFormData({ ...formData, type: 'Expense', category })
            }
            break
          case 'date':
            setFormData({ ...formData, date: entity.value })
            break
          default:
            break
        }
      })

      // If all fields are filled out via voice automatically create the transaction.
      if (
        segment.isFinal &&
        formData.amount &&
        formData.category &&
        formData.type &&
        formData.date
      ) {
        createTransaction()
      }
    }
  }, [segment])

  return (
    <Grid container spacing={2}>
      <CustomisedSnackbar open={open} setOpen={setOpen} />
      <Grid item xs={12}>
        <Typography align="center" variant="subtitle2" gutterBottom>
          {segment && segment.words.map((word) => word.value).join(' ')}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {selectedCategories.map((category) => (
              <MenuItem key={category.type} value={category.type}>
                {category.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="number"
          label="Amount"
          fullWidth
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="date"
          label="Date"
          fullWidth
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: formatDate(e.target.value) })
          }
        />
      </Grid>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        fullWidth
        onClick={createTransaction}
      >
        Create
      </Button>
    </Grid>
  )
}
