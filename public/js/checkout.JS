

var stripe = Stripe('pk_test_55jkXF5hN1CPfsQYtUuYQdQL00kETSqncW');
var elements = stripe.elements();

var card = elements.create('card', {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#8898AA',
      color: 'white',
      lineHeight: '36px',
      fontWeight: 300,
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '19px',

      '::placeholder': {
        color: '#8898AA',
      },
    },
    invalid: {
      iconColor: '#e85746',
      color: '#e85746',
    }
  },
  classes: {
    focus: 'is-focused',
    empty: 'is-empty',
  },
});
card.mount('#card-element');

var inputs = document.querySelectorAll('input.field');
inputs.forEach(function(input) {
  input.addEventListener('focus', function() {
    input.classList.add('is-focused');
  });
  input.addEventListener('blur', function() {
    input.classList.remove('is-focused');
  });
  input.addEventListener('keyup', function() {
    if (input.value.length === 0) {
      input.classList.add('is-empty');
    } else {
      input.classList.remove('is-empty');
    }
  });
});

function setOutcome(result) {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');

  if (result.token) {
    // Use the token to create a charge or a customer
    // https://stripe.com/docs/payments/charges-api
    var form = document.querySelector('#checkout-form');
    form.querySelector('input[name=tokenKeeper]').value = result.token.id;
    successElement.classList.add('visible');
  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');
  }
}

card.on('change', function(event) {
  var form = document.querySelector('#checkout-form');

  
  var extraDetails = {
    name: form.querySelector('input[name=cardholder]').value,
  };
  stripe.createToken(card, extraDetails).then(setOutcome);
});

/* document.querySelector('#checkout-form').addEventListener('submit', function(e) {



  
}); */
 
function inp(){
  var form = document.querySelector('#submitter');
  if(document.querySelector('#checkout-form').querySelector('input[name=tokenKeeper]').value.length() > 0) 
  form.submit();
};
