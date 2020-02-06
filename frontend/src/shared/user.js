import React from "react";

const UserContext = React.createContext();

export const UserProvider = (props) => {
	const [user, setUser] = React.useState('');
	const value = React.useMemo(() => ({ user, setUser }), [user]);
	// const value = { user, setUser };
	return (
		<UserContext.Provider value={value}>
			{props.children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = React.useContext(UserContext);
	if (!context) {
		throw new Error('UserProvider compound components cannot be rendered outside the Toggle component');
	}
	return context;
};
