// AdminPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminSideBar from '../../Components/admin-sidebar.jsx';
import { Dialog } from '@headlessui/react';
import Navbar from "../../Components/Navbar";
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';


const AdminPendingRequest = () => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [viewServicesModal, setViewServicesModal] = useState(false);
    const [viewPaymentModal, setViewPaymentModal] = useState(false);
    const [transactions, setTransactions] = useState([]);
    
    // Decline booking modal states
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineStep, setDeclineStep] = useState(1); // 1, 2, or 3 for the different steps
    const [declineReason, setDeclineReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [refundReceipt, setRefundReceipt] = useState(null);
    const [refundReceiptPreview, setRefundReceiptPreview] = useState('');
    const [submittingDecline, setSubmittingDecline] = useState(false);
    const [declineSuccess, setDeclineSuccess] = useState(false);
    
    // Ref for file input
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        axios.get('http://localhost:8080/api/transactions/getAllPendingTransactions')
            .then((res) => {
                    setTransactions(res.data);
                    console.log(res.data);
            })
            .catch((err) => {
                console.log(err)
            });
    }
    
    // Function to handle opening the decline modal
    const handleDeclineClick = () => {
        setShowDeclineModal(true);
        setDeclineStep(1);
        setDeclineReason('');
        setOtherReason('');
        setRefundReceipt(null);
        setRefundReceiptPreview('');
        setDeclineSuccess(false);
    };

    // Function to handle closing the decline modal
    const handleCloseDeclineModal = () => {
        if (declineSuccess) {
            // If we've successfully declined, also close the main request modal
            setSelectedRequest(null);
        }
        setShowDeclineModal(false);
        setDeclineStep(1);
    };
    
    // Function to handle file selection for refund receipt
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRefundReceipt(file);
            const reader = new FileReader();
            reader.onload = () => {
                setRefundReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Function to handle submitting the final decline with reason
    const handleSubmitDecline = () => {
        setSubmittingDecline(true);
        
        // Create form data to send receipt image
        const formData = new FormData();
        if (refundReceipt) {
            formData.append('refundReceipt', refundReceipt);
        }
        
        // Determine the final reason text
        const finalReason = declineReason === 'Other' ? otherReason : declineReason;
        
        // Make the API call to decline the transaction
        axios.put(
            `http://localhost:8080/api/transactions/validateTransaction?transactionId=${selectedRequest?.transaction_Id}&status=DECLINED`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    reason: finalReason
                }
            }
        )
        .then((response) => {
            console.log(response.data);
            setDeclineSuccess(true);
            setDeclineStep(4); // Move to success message
            fetchData(); // Refresh the list
        })
        .catch((err) => {
            if (err.response) {
                console.log(`[ERROR] Status: ${err.response.status}, Message: ${err.response.data?.message || 'No message'}`);
            } else if (err.request) {
                console.log('[ERROR] No response from server');
            } else {
                console.log(`[ERROR] ${err.message}`);
            }
        })
        .finally(() => {
            setSubmittingDecline(false);
        });
    };
    
    const ValidateTransaction = (validate) => {
        if (validate === "DECLINED") {
            // Open the decline flow instead of immediate decline
            handleDeclineClick();
            return;
        }
        
        // For approve or other actions, continue with the original flow
        axios.put(`http://localhost:8080/api/transactions/validateTransaction?transactionId=${selectedRequest?.transaction_Id}&status=${validate}`)
            .then((response) => {
                console.log(response.data);
                fetchData();
            })
            .catch((err) => {
                if (err.response) {
                    console.log(`[ERROR] Status: ${err.response.status}, Message: ${err.response.data?.message || 'No message'}`);
                } else if (err.request) {
                    console.log('[ERROR] No response from server');
                } else {
                    console.log(`[ERROR] ${err.message}`);
                }
            })
            .finally(() => {
                setSelectedRequest(null);
                setViewServicesModal(false);
                setViewPaymentModal(false);
            });
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden md:block w-64 border-r bg-white">
                    <AdminSideBar />
                </aside>

                <main className="flex-1 p-4 sm:p-6 md:p-10 bg-gray-50 overflow-auto">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Pending Requests</h2>
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-[#F1F1FB] text-gray-700">
                            <tr>
                                <th className="p-3 sm:p-4 whitespace-nowrap">Name</th>
                                <th className="p-3 sm:p-4 whitespace-nowrap">Event Date</th>
                                <th className="p-3 sm:p-4 whitespace-nowrap">Event Type</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions?.map((req) => (
                                <tr key={req.transaction_Id} className="hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                    <td className="p-3 sm:p-4 whitespace-nowrap text-[#667085]">{req.userName}</td>
                                    <td className="p-3 sm:p-4 whitespace-nowrap text-[#667085]">{req.transactionDate.split(' - ')[0]}</td>
                                    <td className="p-3 sm:p-4 whitespace-nowrap text-[#667085]">{req.eventName}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            <Dialog open={!!selectedRequest && !viewServicesModal && !viewPaymentModal} onClose={() => setSelectedRequest(null)} className="fixed z-1150 shadow-md inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Dialog.Panel className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-4 sm:p-6 space-y-6">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-xl font-semibold">Booking Details</h3>
                            <button onClick={() => setSelectedRequest(null)} className="text-xl hover:cursor-pointer">×</button>
                        </div>

                        {selectedRequest && (
                            <>
                                <div>
                                    <h4 className="font-semibold mb-2 text-[#FFB22C]">Personal Detail</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2 w-auto">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 block mb-1">Name</label>
                                                <input type="text" className="border p-2 rounded w-full" value={selectedRequest.userName} readOnly />
                                            </div>
                                            <div className="col-span-1 sm:col-span-2">
                                                <label className="text-sm font-medium text-gray-500 block mb-1">Contact</label>
                                                <input type="text" className="border p-2 rounded w-auto" value={selectedRequest.phoneNumber} readOnly />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
                                            <input type="text" className="border p-2 rounded w-full" value={selectedRequest.userEmail} readOnly />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mt-6 mb-2 text-[#FFB22C]">Event Detail</h4>
                                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 w-auto">
                                        <div className="flex flex-col gap-2 w-auto">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 block mb-1">Event Type</label>
                                                <input type="text" className="border p-2 rounded w-full" value={selectedRequest.eventName} readOnly />
                                            </div>
                                            {
                                                selectedRequest.packages!=null?(
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-500 block mb-1">Package Type</label>
                                                        <input type="text" className="border p-2 rounded w-full" value={selectedRequest.packageType} readOnly />
                                                    </div>
                                                ):

                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 block mb-1">Package Type</label>
                                                    <input type="text" className="border p-2 rounded w-full" value={"N/A"} readOnly />
                                                </div>
                                            }
                                        </div>
                                        <div className="flex flex-col gap-2 w-auto">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 block mb-1">Location</label>
                                                <input type="text" className="border p-2 rounded w-full" value={selectedRequest.transactionVenue} readOnly />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 block mb-1">Date</label>
                                                <input type="text" className="border p-2 rounded w-full" value={selectedRequest.transactionDate} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col mt-2">
                                    <div className="flex text-sm gap-2">
                                        <div>
                                            <label className="text-sm font-medium align-text-bottom text-gray-500 block mb-1">Note</label>
                                        </div>
                                        <div className="flex ml-auto gap-2">
                                            <button className="text-[#FFB22C] hover:underline" onClick={() => setViewPaymentModal(true)}>View Payment</button>
                                            <button className="text-[#FFB22C] hover:underline" onClick={() => setViewServicesModal(true)}>View Chosen Services</button>
                                        </div>
                                    </div>
                                    <div>
                                        <textarea readOnly className="w-full border p-3 rounded text-sm text-gray-600" value={selectedRequest.transactionNote}></textarea>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                                    <button className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                                    onClick={()=> ValidateTransaction("DECLINED")}>Decline</button>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                                    onClick={()=> ValidateTransaction("APPROVED")}>Approve</button>
                                </div>
                            </>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
            
            {/* Multi-Step Decline Booking Modal */}
            <Dialog open={showDeclineModal} onClose={handleCloseDeclineModal} className="fixed z-1200 shadow-md inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Dialog.Panel className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
                        {/* Step 1: Confirmation */}
                        {declineStep === 1 && (
                            <>
                                <div className="flex justify-between items-center border-b pb-3">
                                    <h3 className="text-xl font-semibold text-red-600">Decline Booking</h3>
                                    <button onClick={handleCloseDeclineModal} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                                </div>
                                
                                <div className="py-6">
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                        <p className="text-red-700">Are you sure you want to decline this booking? Customer has already made a payment. Prepare for refund via GCash.</p>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4">Declining this booking will require you to provide a reason and process a refund for the customer.</p>
                                </div>
                                
                                <div className="flex justify-end gap-3">
                                    <button 
                                        onClick={handleCloseDeclineModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => setDeclineStep(2)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Yes, Continue
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {/* Step 2: Select Reason */}
                        {declineStep === 2 && (
                            <>
                                <div className="flex justify-between items-center border-b pb-3">
                                    <h3 className="text-xl font-semibold">Provide Reason</h3>
                                    <button onClick={handleCloseDeclineModal} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                                </div>
                                
                                <div className="py-6">
                                    <p className="text-gray-600 mb-4">Please state your reason for declining this booking. (required)</p>
                                    
                                    <div className="mb-4">
                                        <select 
                                            value={declineReason} 
                                            onChange={(e) => setDeclineReason(e.target.value)}
                                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        >
                                            <option value="">Select a reason</option>
                                            <option value="The customer is not from Masbate, and the organizer currently does not accept bookings outside Masbate.">The customer is not from Masbate, and the organizer currently does not accept bookings outside Masbate.</option>
                                            <option value="Due to emergency reasons.">Due to emergency reasons.</option>
                                            <option value="On a business trip on the proposed event date">On a business trip on the proposed event date</option>
                                            <option value="The event is too large and beyond the organizer's capacity.">The event is too large and beyond the organizer's capacity.</option>
                                            <option value="Other">Other (specify)</option>
                                        </select>
                                    </div>
                                    
                                    {declineReason === 'Other' && (
                                        <div className="mb-4">
                                            <textarea 
                                                value={otherReason} 
                                                onChange={(e) => setOtherReason(e.target.value)}
                                                placeholder="Please specify your reason..."
                                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                                rows="3"
                                                required
                                            ></textarea>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex justify-between gap-3">
                                    <button 
                                        onClick={() => setDeclineStep(1)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={() => setDeclineStep(3)}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        disabled={!declineReason || (declineReason === 'Other' && !otherReason)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {/* Step 3: Upload Refund Receipt */}
                        {declineStep === 3 && (
                            <>
                                <div className="flex justify-between items-center border-b pb-3">
                                    <h3 className="text-xl font-semibold">Process Refund</h3>
                                    <button onClick={handleCloseDeclineModal} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                                </div>
                                
                                <div className="py-6">
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                        <p className="text-blue-700 font-semibold">Payment Reference Number:</p>
                                        <p className="text-blue-700 font-mono text-lg">{selectedRequest?.payment?.paymentReferenceNumber || 'N/A'}</p>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4">Please upload a screenshot of the GCash refund receipt:</p>
                                    
                                    <div 
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                        
                                        {refundReceiptPreview ? (
                                            <img src={refundReceiptPreview} alt="Refund Receipt" className="max-h-64 mx-auto rounded" />
                                        ) : (
                                            <div className="py-4">
                                                <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-500">Click to upload refund receipt</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex justify-between gap-3">
                                    <button 
                                        onClick={() => setDeclineStep(2)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={handleSubmitDecline}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                                        disabled={submittingDecline || !refundReceipt}
                                    >
                                        {submittingDecline ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            'Finish'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {/* Step 4: Success Message */}
                        {declineStep === 4 && (
                            <>
                                <div className="flex justify-between items-center border-b pb-3">
                                    <h3 className="text-xl font-semibold text-green-600">Booking Declined</h3>
                                    <button onClick={handleCloseDeclineModal} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                                </div>
                                
                                <div className="py-8 text-center">
                                    <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Successfully Declined</h3>
                                    <p className="text-gray-500">The customer has been notified and the refund has been processed.</p>
                                </div>
                                
                                <div className="flex justify-center">
                                    <button 
                                        onClick={handleCloseDeclineModal}
                                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Done
                                    </button>
                                </div>
                            </>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>

            <Dialog open={!!selectedRequest && viewServicesModal} onClose={() => setViewServicesModal(false)} className="fixed z-1150 shadow-md inset-0 overflow-y-auto hover:cursor-pointer">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Dialog.Panel className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-4 sm:p-6">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-xl font-semibold">Booking Details</h3>
                            <button onClick={() => setViewServicesModal(false)} className="text-xl">×</button>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-[#F79009] font-semibold mb-4">Chosen Services</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto text-sm text-left">
                                    <thead className="bg-indigo-50">
                                    <tr>
                                        <th className="p-3 text-[#667085] font-semibold">Service Type</th>
                                        <th className="p-3 text-[#667085] font-semibold">Subcontractor</th>
                                        <th className="p-3 text-[#667085] font-semibold">Representative</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedRequest?.subcontractors?.map((service, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="p-3 text-[#667085]">{service.serviceCategory}</td>
                                            <td className="p-3 text-[#667085]">{service.serviceName}</td>
                                            <td className="p-3 text-[#667085]">{service.subcontractorName}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex justify-end pt-6">
                            <button onClick={() => setViewServicesModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">Close</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <Dialog open={!!selectedRequest && viewPaymentModal} onClose={() => setViewPaymentModal(false)} className="fixed z-1150 shadow-md inset-0 overflow-y-auto hover:cursor-pointer">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Dialog.Panel className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-4 sm:p-6">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-xl font-semibold">Booking Details</h3>
                            <button onClick={() => setViewPaymentModal(false)} className="text-xl">×</button>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-[#F79009] font-semibold mb-4">Payment Details</h4>
                            <div className="flex justify-center items-center bg-gray-100 p-4 rounded">
                                <img src={selectedRequest?.payment.paymentReceipt} alt="Payment Proof" className="max-h-[500px] rounded" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-6">
                            <button onClick={() => setViewPaymentModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">Close</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default AdminPendingRequest;
