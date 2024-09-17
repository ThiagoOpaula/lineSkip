pub struct PaymentService;

impl PaymentService {
    pub async fn process_payment(amount: f64) -> Result<(), String> {
        // Simulate payment processing
        println!("Processing payment of ${}", amount);
        Ok(())
    }
}
