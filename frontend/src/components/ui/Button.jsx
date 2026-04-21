export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"

  const variants = {
    primary: "bg-blue-700 text-white shadow-blue-200 hover:bg-blue-800",
    secondary: "bg-gray-900 text-white hover:bg-black",
    orange: "bg-orange-500 text-white shadow-orange-100 hover:bg-orange-600",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}