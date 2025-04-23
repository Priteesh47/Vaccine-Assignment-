export const createCustomIcon = (color) =>
	L.divIcon({
		className: "custom-marker",
		html: `
      <div style="
        position: relative;
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">+</div>
      </div>
    `,
		iconSize: [30, 42],
		iconAnchor: [15, 42],
		popupAnchor: [0, -36]
	});
