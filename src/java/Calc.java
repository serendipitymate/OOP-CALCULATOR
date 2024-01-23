import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Calc extends JFrame {
    private JTextField displayField;
    private Calculator calculator;

    public Calc() {
        // Set up the JFrame
        super("Simple Calculator");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(300, 400);
        setLayout(new BorderLayout());

        // Create the display field
        displayField = new JTextField();
        displayField.setEditable(false);
        displayField.setFont(new Font("Arial", Font.PLAIN, 20));
        add(displayField, BorderLayout.NORTH);

        // Create the number buttons
        JPanel buttonPanel = new JPanel(new GridLayout(4, 4));
        String[] buttonLabels = {"7", "8", "9", "/",
                                 "4", "5", "6", "*",
                                 "1", "2", "3", "-",
                                 "0", ".", "=", "+"};

        calculator = new Calculator(0, 0);

        for (String label : buttonLabels) {
            JButton button = new JButton(label);
            button.addActionListener(new ButtonClickListener());
            button.setFont(new Font("Arial", Font.PLAIN, 18));
            buttonPanel.add(button);
        }

        add(buttonPanel, BorderLayout.CENTER);
    }

    private class ButtonClickListener implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            JButton source = (JButton) e.getSource();
            String buttonText = source.getText();

            if (Character.isDigit(buttonText.charAt(0)) || buttonText.equals(".")) {
                displayField.setText(displayField.getText() + buttonText);
            } else if (buttonText.equals("=")) {
                calculateResult();
            } else {
                // Store the current operation and operand
                calculator.setOperand1(Double.parseDouble(displayField.getText()));
                calculator.setOperand2(0);
                calculator.setOperation(buttonText);
                displayField.setText("");
            }
        }

        private void calculateResult() {
            if (!displayField.getText().isEmpty()) {
                calculator.setOperand2(Double.parseDouble(displayField.getText()));
                double result = calculator.calculate();
                displayField.setText(String.valueOf(result));
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            Calc calculatorGUI = new Calc();
            calculatorGUI.setVisible(true);
        });
    }
}

// Calculator.java

