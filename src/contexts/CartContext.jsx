import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gameblox_cart') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('gameblox_cart', JSON.stringify(items))
  }, [items])

  function addItem(product) {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) {
        toast('Déjà dans le panier', { icon: '🛒' })
        return prev
      }
      toast.success('Ajouté au panier !')
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Retiré du panier')
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.length

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
