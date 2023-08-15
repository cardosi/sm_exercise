import { test } from 'vitest'
import { formattedName, itemExists } from '../utils'

describe('utils', () => {
  test('formattedName function', () => {
    expect(formattedName(' test ')).toBe('Test')
    expect(formattedName(' Test ')).toBe('Test')
    expect(formattedName(' TEST ')).toBe('Test')
    expect(formattedName('tEsT  ')).toBe('Test')
    expect(formattedName('  tEST TEST    test   ')).toBe('Test Test Test')
  })

  test('itemExists function', () => {
    const pizzas = [{ name: 'Margherita', id: 1 }, { name: 'Pepperoni', id: 2 }]
    const toppings = [{ name: 'Mushrooms', id: 1 }, { name: 'Peppers', id: 2 }]
  
    expect(itemExists(pizzas, 'margherita')).toBe(true)
    expect(itemExists(pizzas, ' Margherita ')).toBe(true)
    expect(itemExists(pizzas, 'pepperoni')).toBe(true)
    expect(itemExists(pizzas, 'Hawaiian')).toBe(false)
  
    expect(itemExists(toppings, 'mushrooms')).toBe(true)
    expect(itemExists(toppings, ' Mushrooms ')).toBe(true)
    expect(itemExists(toppings, 'peppers')).toBe(true)
    expect(itemExists(toppings, 'Pineapple')).toBe(false)
  })
})
    

