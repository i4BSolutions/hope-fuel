

export default function FundraisersLayout({ children, modal }) {
   console.log("modal:", modal);
    console.log("children:",children);
    
  return (
    <>
      {children}
      {modal}
    </>
  );
}
