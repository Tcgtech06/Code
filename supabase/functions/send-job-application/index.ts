const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      firstName, 
      lastName, 
      email, 
      contact, 
      graduationYear, 
      gender, 
      position, 
      experience, 
      currentEmployer, 
      currentSalary,
      expectedSalary,
      skills, 
      location,
      resumeUploaded
    } = await req.json()

    // Validate required fields
    if (!firstName || !email || !contact || !position) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Format salary for WhatsApp message
    const formatSalary = (amount: string) => {
      if (!amount) return 'N/A';
      const num = parseInt(amount);
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    };

    // Create WhatsApp message
    const fullName = lastName ? `${firstName} ${lastName}` : firstName
    
    let salaryInfo = '';
    if (currentEmployer === 'Yes') {
      salaryInfo = `\n💰 *Salary Info:*\nCurrent: ${formatSalary(currentSalary)}\nExpected: ${formatSalary(expectedSalary)}`;
    }

    const whatsappMessage = `🎯 *New Job Application*

👤 *Personal Details:*
Name: ${fullName}
Email: ${email}
Contact: ${contact}
Gender: ${gender}
Location: ${location}

💼 *Professional Details:*
Position: ${position}
Experience: ${experience} years
Graduation Year: ${graduationYear}
Currently Employed: ${currentEmployer}${salaryInfo}
Skills: ${skills}
Resume: ${resumeUploaded === 'Yes' ? 'Uploaded ✅' : 'Not uploaded ❌'}

📅 Applied on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

View full details in admin panel.`

    // Send WhatsApp message using WhatsApp Business API or third-party service
    const whatsappNumber = '+919791962802' // Replace with your actual WhatsApp number
    
    try {
      // For now, we'll just log the message since we don't have a WhatsApp API setup
      console.log('WhatsApp message to send:', whatsappMessage)
      console.log('WhatsApp number:', whatsappNumber)
    } catch (whatsappError) {
      console.error('❌ WhatsApp sending error:', whatsappError)
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '✅ Your application has been submitted successfully! We will contact you soon.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Error processing job application:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: '❌ Submission Failed! Please retry or contact us directly.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})