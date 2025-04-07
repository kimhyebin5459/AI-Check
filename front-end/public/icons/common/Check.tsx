interface Props {
  isSelected: boolean;
}

export default function Check({ isSelected }: Props) {
  return (
    <div
      className={`${isSelected ? 'border-yellow-300 bg-yellow-300' : 'border-gray-300 bg-white'} flex size-6 items-center justify-center rounded-full border`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
        <path
          d="M8.58688 13.9871L16.9573 5.61661C17.1549 5.41908 17.3853 5.32031 17.6487 5.32031C17.9121 5.32031 18.1425 5.41908 18.3401 5.61661C18.5376 5.81415 18.6364 6.04888 18.6364 6.32082C18.6364 6.59276 18.5376 6.82716 18.3401 7.02404L9.27824 16.1106C9.08071 16.3081 8.85026 16.4069 8.58688 16.4069C8.3235 16.4069 8.09305 16.3081 7.89551 16.1106L3.64855 11.8636C3.45102 11.6661 3.3562 11.4317 3.3641 11.1604C3.372 10.8891 3.47505 10.6544 3.67324 10.4562C3.87143 10.258 4.10617 10.1592 4.37745 10.1599C4.64873 10.1605 4.88313 10.2593 5.08067 10.4562L8.58688 13.9871Z"
          fill={`${isSelected ? 'white' : '#CAD0D7'}`}
        />
      </svg>
    </div>
  );
}
