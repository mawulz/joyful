"use client"

interface ContributionBtnProps {
  onClick: () => void
}

const ExploreBtn = ({ onClick }: ContributionBtnProps) => {
    
    return (
        <button 
         type="button" 
         id="contribution-btn" 
         className="mt-7 mx-auto px-8 py-2 rounded-full bg-secondary shadow-lg shadow-secondary/50" 
         onClick={onClick} 
         >
            <a href="#">Wujudkan Harapan Mereka</a>
        </button>
    )
}

export default ExploreBtn