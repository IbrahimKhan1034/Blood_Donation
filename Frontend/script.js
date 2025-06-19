document.addEventListener('DOMContentLoaded', function() {
      // Navigation between forms
      const navButtons = document.querySelectorAll('nav button');
      const formSections = document.querySelectorAll('.form-section');
      
      
      navButtons.forEach(button => {
        button.addEventListener('click', function() {
          navButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          const targetId = this.id.replace('Btn', 'Form');
          formSections.forEach(form => {
            form.classList.remove('active');
            if (form.id === targetId) {
              form.classList.add('active');
            }
          });
          
          document.querySelectorAll('.data-section').forEach(section => {
            section.style.display = 'none';
          });
        });
      });
      
      // Phone number management
      const addPhoneBtn = document.getElementById('addPhoneBtn');
      const phoneInputs = document.getElementById('phoneInputs');
      
      addPhoneBtn.addEventListener('click', function() {
        const phoneInputDiv = document.createElement('div');
        phoneInputDiv.className = 'phone-input';
        phoneInputDiv.innerHTML = `
          <input type="tel" placeholder="Enter phone number" required />
          <button type="button" class="remove-phone-btn">×</button>
        `;
        phoneInputs.appendChild(phoneInputDiv);
        
        if (phoneInputs.children.length > 1) {
          document.querySelectorAll('.remove-phone-btn').forEach(btn => {
            btn.disabled = false;
          });
        }
      });
      
      phoneInputs.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-phone-btn') && !e.target.disabled) {
          e.target.parentElement.remove();
          
          if (phoneInputs.children.length === 1) {
            document.querySelector('.remove-phone-btn').disabled = true;
          }
        }
      });
      
      function showSuccessMessage(message) {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
      }
      
      window.closeDataSection = function(sectionId) {
        document.getElementById(sectionId).style.display = 'none';
      };
      
      // Form submissions
      document.getElementById('addDonorForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const phoneInputs = document.querySelectorAll('#phoneInputs input');
        const phoneNumbers = Array.from(phoneInputs).map(input => input.value);
        
        const data = {
          name: document.getElementById('name').value,
          gender: document.getElementById('gender').value,
          dob: document.getElementById('dob').value,
          blood_type: document.getElementById('blood_type').value,
          phone_numbers: phoneNumbers
        };
        
        try {
          const res = await fetch('http://localhost:3000/add-donor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          
          const result = await res.json();
          showSuccessMessage(`Donor registered successfully with ID: ${result.donorId}`);
          this.reset();
          
          phoneInputs.forEach((input, index) => {
            if (index > 0) input.parentElement.remove();
          });
          phoneInputs[0].value = '';
          
        } catch (error) {
          console.error('Error registering donor:', error);
          alert('Error registering donor: ' + error.message);
        }
      });
      
      document.getElementById('addDonationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
          donor_id: document.getElementById('donor_id').value,
          date: document.getElementById('donation_date').value,
          quantity: document.getElementById('quantity').value,
          location: document.getElementById('location').value
        };
        
        try {
          const res = await fetch('http://localhost:3000/add-donation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          
          const result = await res.json();
          showSuccessMessage(`Donation recorded successfully with ID: ${result.donationId}`);
          this.reset();
        } catch (error) {
          console.error('Error recording donation:', error);
          alert('Error recording donation: ' + error.message);
        }
      });
      
      document.getElementById('addBloodBankForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
          name: document.getElementById('bank_name').value,
          location: document.getElementById('bank_location').value,
          capacity: document.getElementById('capacity').value,
          contact: document.getElementById('bank_contact').value
        };
        
        try {
          const res = await fetch('http://localhost:3000/add-blood-bank', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          
          const result = await res.json();
          showSuccessMessage(`Blood bank added successfully with ID: ${result.bankId}`);
          this.reset();
        } catch (error) {
          console.error('Error adding blood bank:', error);
          alert('Error adding blood bank: ' + error.message);
        }
      });
      
      document.getElementById('addHospitalForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
          name: document.getElementById('hospital_name').value,
          location: document.getElementById('hospital_location').value,
          contact: document.getElementById('hospital_contact').value
        };
        
        try {
          const res = await fetch('http://localhost:3000/add-hospital', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          
          const result = await res.json();
          showSuccessMessage(`Hospital added successfully with ID: ${result.hospitalId}`);
          this.reset();
        } catch (error) {
          console.error('Error adding hospital:', error);
          alert('Error adding hospital: ' + error.message);
        }
      });
      
      document.getElementById('addRequestForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
          hospital_id: document.getElementById('hospital_id').value,
          bank_id: document.getElementById('bank_id').value,
          blood_type: document.getElementById('request_blood_type').value,
          quantity: document.getElementById('request_quantity').value,
          urgency: document.getElementById('urgency').value,
          date: document.getElementById('request_date').value
        };
        
        try {
          const res = await fetch('http://localhost:3000/add-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          
          const result = await res.json();
          showSuccessMessage(`Blood request submitted successfully with ID: ${result.requestId}`);
          this.reset();
        } catch (error) {
          console.error('Error submitting blood request:', error);
          alert('Error submitting blood request: ' + error.message);
        }
      });
      
      // View All Donors
      document.getElementById('viewDonorsBtn').addEventListener('click', async function() {
        try {
          console.log('Fetching donors with phone numbers...');
          const res = await fetch('http://localhost:3000/donors-with-phones');
          if (!res.ok) {
            throw new Error(`Failed to fetch donors. Status: ${res.status}`);
          }
          const donors = await res.json();
          console.log('Donors received:', donors);

          const tbody = document.querySelector('#donorTable tbody');
          tbody.innerHTML = '';

          if (!donors || donors.length === 0) {
            console.log('No donors found.');
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No donor records found</td></tr>';
          } else {
            donors.forEach(donor => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${donor.Donor_ID}</td>
                <td>${donor.Name || 'Unknown'}</td>
                <td>${donor.Gender || 'N/A'}</td>
                <td>${donor.Date_of_Birth ? new Date(donor.Date_of_Birth).toLocaleDateString() : 'N/A'}</td>
                <td>${donor.Blood_Type || 'N/A'}</td>
                <td>${donor.Phone_Numbers.length > 0 ? donor.Phone_Numbers.join(', ') : 'None'}</td>
              `;
              tbody.appendChild(row);
            });
            console.log('Table populated with', donors.length, 'donors.');
          }

          document.getElementById('donorDataSection').style.display = 'block';
        } catch (error) {
          console.error('Error in View All Donors:', error);
          alert('Error fetching donor data: ' + error.message);
        }
      });
      
      // View All Donations
      document.getElementById('viewDonationsBtn').addEventListener('click', async function() {
        try {
          const res = await fetch('http://localhost:3000/donations');
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          const donations = await res.json();
          
          const tbody = document.querySelector('#donationTable tbody');
          tbody.innerHTML = '';
          
          if (donations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No donation records found</td></tr>';
          } else {
            donations.forEach(donation => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${donation.Donation_ID}</td>
                <td>${donation.Donor_ID}</td>
                <td>${new Date(donation.Date).toLocaleDateString()}</td>
                <td>${donation.Quantity}</td>
                <td>${donation.Location}</td>
              `;
              tbody.appendChild(row);
            });
          }
          
          document.getElementById('donationDataSection').style.display = 'block';
        } catch (error) {
          console.error('Error fetching donation data:', error);
          alert('Error fetching donation data: ' + error.message);
        }
      });
      
      // View All Blood Banks
      document.getElementById('viewBloodBanksBtn').addEventListener('click', async function() {
        try {
          const res = await fetch('http://localhost:3000/blood-banks');
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          const bloodBanks = await res.json();
          
          const tbody = document.querySelector('#bloodBankTable tbody');
          tbody.innerHTML = '';
          
          if (bloodBanks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No blood bank records found</td></tr>';
          } else {
            bloodBanks.forEach(bank => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${bank.Bank_ID}</td>
                <td>${bank.Name}</td>
                <td>${bank.Location}</td>
                <td>${bank.Capacity}</td>
                <td>${bank.Contact_Number}</td>
              `;
              tbody.appendChild(row);
            });
          }
          
          document.getElementById('bloodBankDataSection').style.display = 'block';
        } catch (error) {
          console.error('Error fetching blood bank data:', error);
          alert('Error fetching blood bank data: ' + error.message);
        }
      });
      
      // View All Hospitals
      document.getElementById('viewHospitalsBtn').addEventListener('click', async function() {
        try {
          const res = await fetch('http://localhost:3000/hospitals');
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          const hospitals = await res.json();
          
          const tbody = document.querySelector('#hospitalTable tbody');
          tbody.innerHTML = '';
          
          if (hospitals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hospital records found</td></tr>';
          } else {
            hospitals.forEach(hospital => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${hospital.Hospital_ID}</td>
                <td>${hospital.Name}</td>
                <td>${hospital.Location}</td>
                <td>${hospital.Contact_Number}</td>
              `;
              tbody.appendChild(row);
            });
          }
          
          document.getElementById('hospitalDataSection').style.display = 'block';
        } catch (error) {
          console.error('Error fetching hospital data:', error);
          alert('Error fetching hospital data: ' + error.message);
        }
      });
      
      // View All Blood Requests
      document.getElementById('viewRequestsBtn').addEventListener('click', async function() {
        try {
          const res = await fetch('http://localhost:3000/requests');
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          const requests = await res.json();
          
          const tbody = document.querySelector('#requestTable tbody');
          tbody.innerHTML = '';
          
          if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No blood request records found</td></tr>';
          } else {
            requests.forEach(request => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${request.Request_ID}</td>
                <td>${request.Hospital_ID}</td>
                <td>${request.Bank_ID}</td>
                <td>${request.Blood_Type_Required}</td>
                <td>${request.Quantity_Required}</td>
                <td>${request.Urgency_Level}</td>
                <td>${new Date(request.Request_Date).toLocaleDateString()}</td>
              `;
              tbody.appendChild(row);
            });
          }
          
          document.getElementById('requestDataSection').style.display = 'block';
        } catch (error) {
          console.error('Error fetching blood request data:', error);
          alert('Error fetching blood request data: ' + error.message);
        }
      });
      // Search functionality
document.getElementById('searchDonorBtn').addEventListener('click', async function() {
  const searchTerm = document.getElementById('donorSearch').value;
  try {
    const res = await fetch(`http://localhost:3000/search/donors?term=${encodeURIComponent(searchTerm)}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const donors = await res.json();
    
    const tbody = document.querySelector('#donorTable tbody');
    tbody.innerHTML = '';
    
    if (donors.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No matching donors found</td></tr>';
    } else {
      donors.forEach(donor => {
        const phoneNumbers = donor.Phone_Numbers ? donor.Phone_Numbers.split(',') : [];
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${donor.Donor_ID}</td>
          <td>${donor.Name}</td>
          <td>${donor.Gender}</td>
          <td>${new Date(donor.Date_of_Birth).toLocaleDateString()}</td>
          <td>${donor.Blood_Type}</td>
          <td>${phoneNumbers.join(', ') || 'None'}</td>
        `;
        tbody.appendChild(row);
      });
    }
    document.getElementById('donorDataSection').style.display = 'block';
  } catch (error) {
    console.error('Error searching donors:', error);
    alert('Error searching donors: ' + error.message);
  }
});

document.getElementById('searchDonationBtn').addEventListener('click', async function() {
  const searchTerm = document.getElementById('donationSearch').value;
  try {
    const res = await fetch(`http://localhost:3000/search/donations?term=${encodeURIComponent(searchTerm)}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const donations = await res.json();
    
    updateTableWithData('donationTable', donations, ['Donation_ID', 'Donor_ID', 'Date', 'Quantity', 'Location']);
    document.getElementById('donationDataSection').style.display = 'block';
  } catch (error) {
    console.error('Error searching donations:', error);
    alert('Error searching donations: ' + error.message);
  }
});

document.getElementById('searchBloodBankBtn').addEventListener('click', async function() {
  const searchTerm = document.getElementById('bloodBankSearch').value;
  try {
    const res = await fetch(`http://localhost:3000/search/blood-banks?term=${encodeURIComponent(searchTerm)}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const banks = await res.json();
    
    updateTableWithData('bloodBankTable', banks, ['Bank_ID', 'Name', 'Location', 'Capacity', 'Contact_Number']);
    document.getElementById('bloodBankDataSection').style.display = 'block';
  } catch (error) {
    console.error('Error searching blood banks:', error);
    alert('Error searching blood banks: ' + error.message);
  }
});

document.getElementById('searchHospitalBtn').addEventListener('click', async function() {
  const searchTerm = document.getElementById('hospitalSearch').value;
  try {
    const res = await fetch(`http://localhost:3000/search/hospitals?term=${encodeURIComponent(searchTerm)}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const hospitals = await res.json();
    
    updateTableWithData('hospitalTable', hospitals, ['Hospital_ID', 'Name', 'Location', 'Contact_Number']);
    document.getElementById('hospitalDataSection').style.display = 'block';
  } catch (error) {
    console.error('Error searching hospitals:', error);
    alert('Error searching hospitals: ' + error.message);
  }
});

document.getElementById('searchRequestBtn').addEventListener('click', async function() {
  const searchTerm = document.getElementById('requestSearch').value;
  try {
    const res = await fetch(`http://localhost:3000/search/requests?term=${encodeURIComponent(searchTerm)}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const requests = await res.json();
    
    updateTableWithData('requestTable', requests, ['Request_ID', 'Hospital_ID', 'Bank_ID', 'Blood_Type_Required', 'Quantity_Required', 'Urgency_Level', 'Request_Date']);
    document.getElementById('requestDataSection').style.display = 'block';
  } catch (error) {
    console.error('Error searching requests:', error);
    alert('Error searching requests: ' + error.message);
  }
});

// Helper function for updating tables
function updateTableWithData(tableId, data, columns) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = '';
  
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${columns.length}">No matching records found</td></tr>`;
  } else {
    data.forEach(item => {
      const row = document.createElement('tr');
      columns.forEach(col => {
        const cell = document.createElement('td');
        let value = item[col];
        if (col === 'Date' || col === 'Request_Date') {
          value = new Date(value).toLocaleDateString();
        }
        cell.textContent = value;
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
  }
}
    });