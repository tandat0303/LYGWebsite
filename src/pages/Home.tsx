// import { logout } from "../features/authSlice";
// import { useAppDispatch } from "../hooks/auth";
// import storage from "../libs/storage";

// export default function Home() {
//   const dispatch = useAppDispatch();

//   const handleLogout = () => {
//     storage.remove("auth");
//     dispatch(logout());
//     window.location.href = "/login";
//   };

//   return (
//     <div className="flex">
//       <span className="mr-5">Home</span>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }

export default function Home() {
  return <div>Home</div>;
}
