import React, { useState, memo, useMemo, useCallback, useEffect } from 'react';

const UserCard = memo(({ user, onUpdate }) => {
  // Bug: Creates new object on every render
  const userStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px',
    backgroundColor: user.isActive ? '#e0ffe0' : '#ffe0e0',
  };

  const handleOnUpdate = useCallback(() => {
    onUpdate(user.id, { isActive: !user.isActive })
  }, [onUpdate])

  return (
    <div style={userStyle}>
      <h3>{user.name}</h3>
      <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
      {/* Bug: New function on every render */}
      <button onClick={handleOnUpdate}>
        Toggle Status
      </button>
    </div>
  );
});

export function App() {
  const [numberCount, setNumberCount] = useState(0)
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([
    { id: 1, name: 'John', isActive: true },
    { id: 2, name: 'Jane', isActive: false },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  // Bug 1: Infinite rerendering
  useEffect(() => {
    setCount(count + 1);
  }, []);

  // Bug 2: Function recreated every render
  const updateUser = useCallback((userId, updates) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
  }, [users]);


  // Bug 3: Expensive calculation done on every render
  const filteredUsers = useMemo(() => users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [users, searchTerm])


  // Bug 4: Multiple state updates causing unnecessary renders
  const addNewUser = useCallback(() => {
    const newUser = {
      id: users.length + 1,
      name: `User ${users.length + 1}`,
      isActive: true,
    };
    setUsers([...users, newUser]);
    setCount(count + 1);
  }, [users])

  const activeUserCount = useMemo(() => users.filter(user => user.isActive).length, [users])

  return (
    <div className='App'>
      {numberCount}
      <button onClick={() => setNumberCount(numberCount + 1)}>Add Number</button>

      <h1>User Dashboard (Renders: {count})</h1>

      <div>
        <input
          type='text'
          placeholder='Search users...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={addNewUser}>Add User</button>
      </div>

      <div>
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} onUpdate={updateUser} />
        ))}
      </div>

      {/* Bug 5: Renders on every state change */}
      <div>Active Users: {activeUserCount}</div>
    </div>
  );
}

// Debug log
console.log('Component rendered');
