"use client"

interface VolunteerBtnProps {
  onClick: () => void
}

const VolunteerBtn = ({ onClick }: VolunteerBtnProps) => {
    return (
        <button 
         type="button" 
         id="volunteer-btn" 
         className="mt-7 mx-auto px-8 py-2 rounded-full bg-accent shadow-lg shadow-accent/20" 
         onClick={onClick} 
         >
            <a href="#">Daftar Sekarang</a>
        </button>
    )
}

export default VolunteerBtn