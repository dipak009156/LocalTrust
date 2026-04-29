export const mockData = {
  metrics: {
    pendingVerifications: 12,
    activeDisputes: 3,
    totalEscrow: 45200,
    completedBookings: 1240
  },
  verifications: [
    { id: 'V101', name: 'Ramesh K.', phone: '+91 9876543210', city: 'Mumbai', skill: 'Plumber', date: '12 Oct 2023', aadhaarStatus: 'Pending', score: 85, police: 'Cleared' },
    { id: 'V102', name: 'Suresh M.', phone: '+91 9876543211', city: 'Delhi', skill: 'Electrician', date: '11 Oct 2023', aadhaarStatus: 'Pending', score: 92, police: 'Cleared' },
    { id: 'V103', name: 'Anita D.', phone: '+91 9876543212', city: 'Bangalore', skill: 'Cleaning', date: '10 Oct 2023', aadhaarStatus: 'Pending', score: 78, police: 'Pending' }
  ],
  disputes: [
    { id: 'D201', bookingId: 'TW8492', service: 'Tap Repair', customer: 'Priya Sharma', worker: 'Ramesh K.', amount: 249, time: '2h ago', reason: 'Job not completed properly', workerResponse: 'I fixed it correctly.' },
    { id: 'D202', bookingId: 'TW8495', service: 'Fan Repair', customer: 'Rahul V.', worker: 'Suresh M.', amount: 199, time: '5h ago', reason: 'Worker was rude', workerResponse: 'Customer was yelling.' }
  ],
  bookings: [
    { id: 'TW8492', service: 'Tap Repair', customer: 'Priya Sharma', worker: 'Ramesh K.', status: 'Disputed', price: 249, escrow: 'Locked', date: '12 Oct 2023' },
    { id: 'TW8493', service: 'AC Gas Fill', customer: 'Sneha R.', worker: 'Amit P.', status: 'In Progress', price: 1499, escrow: 'Held', date: '12 Oct 2023' },
    { id: 'TW8494', service: 'Deep Cleaning', customer: 'Vikram S.', worker: 'Anita D.', status: 'Pending', price: 2999, escrow: 'Awaiting', date: '13 Oct 2023' },
    { id: 'TW8495', service: 'Fan Repair', customer: 'Rahul V.', worker: 'Suresh M.', status: 'Completed', price: 199, escrow: 'Released', date: '11 Oct 2023' },
    { id: 'TW8496', service: 'Sofa Cleaning', customer: 'Neha M.', worker: 'Pooja K.', status: 'Completed', price: 899, escrow: 'Released', date: '10 Oct 2023' }
  ],
  customers: [
    { id: 'C301', name: 'Priya Sharma', phone: '+91 9876543210', city: 'Mumbai', bookings: 12, joinDate: 'Jan 2023', status: 'Active' },
    { id: 'C302', name: 'Rahul V.', phone: '+91 9876543211', city: 'Delhi', bookings: 5, joinDate: 'Mar 2023', status: 'Active' },
    { id: 'C303', name: 'Sneha R.', phone: '+91 9876543212', city: 'Bangalore', bookings: 8, joinDate: 'Feb 2023', status: 'Banned' }
  ],
  workers: [
    { id: 'W401', name: 'Ramesh K.', phone: '+91 9876543213', city: 'Mumbai', skill: 'Plumber', rating: 4.8, jobs: 124, status: 'Verified', availability: 'Online' },
    { id: 'W402', name: 'Suresh M.', phone: '+91 9876543214', city: 'Delhi', skill: 'Electrician', rating: 4.9, jobs: 89, status: 'Verified', availability: 'Offline' },
    { id: 'W403', name: 'Amit P.', phone: '+91 9876543215', city: 'Mumbai', skill: 'AC Repair', rating: 4.5, jobs: 42, status: 'Pending', availability: 'Offline' }
  ],
  analytics: {
    revenue: [
      { name: 'Mon', amount: 4000 },
      { name: 'Tue', amount: 3000 },
      { name: 'Wed', amount: 2000 },
      { name: 'Thu', amount: 2780 },
      { name: 'Fri', amount: 1890 },
      { name: 'Sat', amount: 2390 },
      { name: 'Sun', amount: 3490 },
    ],
    categories: [
      { name: 'Plumbing', count: 400 },
      { name: 'Electrical', count: 300 },
      { name: 'Cleaning', count: 300 },
      { name: 'AC Repair', count: 200 },
    ],
    topWorkers: [
      { name: 'Ramesh K.', jobs: 124, rating: 4.8, earnings: 45000 },
      { name: 'Suresh M.', jobs: 89, rating: 4.9, earnings: 32000 },
      { name: 'Anita D.', jobs: 76, rating: 4.7, earnings: 28000 }
    ],
    topCities: [
      { name: 'Mumbai', count: 1240 },
      { name: 'Delhi', count: 980 },
      { name: 'Bangalore', count: 850 }
    ]
  }
};
