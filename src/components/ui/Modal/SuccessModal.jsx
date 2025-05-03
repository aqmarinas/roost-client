// import Button from "../../atom/Button";
import Modal from ".";

export default function SuccessModal({ open, onClose }) {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Request Booking Success"
      >
        <p className="text-gray-500 text-sm pb-3">Your meeting room has been successfully booked.</p>
        <div className="bg-gray-100 rounded-lg p-4 text-sm">
          <p>
            <span className="font-bold">Full Name: </span>John Doe
          </p>
          <p>
            <span className="font-bold">Email: </span>johndoe@xyz.co.id
          </p>
          <p>
            <span className="font-bold">Date: </span>Senin, 4 Januari 2023
          </p>
          <p>
            <span className="font-bold">Time: </span>09.00 - 10.00
          </p>
          <p>
            <span className="font-bold">Room: </span>Tokyo
          </p>
        </div>
        {/* <Button
          text="Back to Home"
          type="button"
        /> */}
      </Modal>
    </>
  );
}
